import { deleteImage } from "../framework/FileHandler.js";
import { logger } from "../framework/functions.js";
import Model from "./Model.js";
class CarImagesModel extends Model {
    constructor() {
        super("carImage", [
            'isMain', 'carID',
            'path', 'extension'
        ]);
    }
    async storeImages(carID, files) {
        try {
            if (!files || files.length === 0) {
                throw { status: 400, message: "You haven't attached any files!" };
            }
            const existingMain = await this.model.findFirst({
                where: { carID, isMain: true }
            });
            const storedImages = await Promise.all(files.map((file, idx) => this.model.create({
                data: {
                    carID,
                    path: file.filename,
                    extension: file.filename.split('.').pop() || '',
                    isMain: existingMain ? false : idx === 0
                }
            })));
            return {
                status: 200,
                message: "Uploaded successfully!",
                data: storedImages
            };
        }
        catch (err) {
            logger(err, "CarImagesModel", "storeImages");
            throw {
                status: err.status || 500,
                message: err.message || "Error storing images."
            };
        }
    }
    async updateMainImage(imageID, carID, userID) {
        try {
            await this.model.updateMany({
                where: {
                    carID, isMain: true
                },
                data: { isMain: false }
            });
            const updatedImage = await this.model.update({
                where: { imageID, car: { userID } },
                data: { isMain: true }
            });
            if (!updatedImage) {
                throw {
                    status: 400,
                    message: "The image doesn't exist, or you don't have permission to modify it!"
                };
            }
            return {
                status: 200,
                message: "Main image updated successfully.",
                data: updatedImage
            };
        }
        catch (err) {
            logger(err, "CarImagesModel", "updateMainImage");
            if (err.name && err.name === 'PrismaClientKnownRequestError') {
                throw {
                    status: 400,
                    message: "The image doesn't exist, or you don't have permission to modify it!"
                };
            }
            throw {
                status: err.status || 500,
                message: err.message || "Error updating main image."
            };
        }
    }
    async getImagesByCar(carID, userID) {
        try {
            const images = await this.model.findMany({
                where: {
                    carID,
                    car: { userID }
                },
                orderBy: { isMain: 'desc' }
            });
            return {
                status: 200,
                data: images
            };
        }
        catch (err) {
            logger(err, "CarImagesModel", "getImagesByCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving images."
            };
        }
    }
    async getImageByID(imageID) {
        try {
            const response = await this.model.findFirst({
                where: { imageID }
            });
            if (!response) {
                throw {
                    status: 404,
                    message: "The image is not found!"
                };
            }
            return response;
        }
        catch (err) {
            logger(err, "CarImagesModel", "getImagesByCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving images."
            };
        }
    }
    async deleteImage(imageID, userID) {
        try {
            const img = await this.getImageByID(imageID);
            const path = `uploads/${img.path}`;
            const deleted = await deleteImage(path);
            if (!deleted) {
                throw {
                    status: 503,
                    message: "The system could not delet the file!"
                };
            }
            const response = await this.model.delete({
                where: { imageID, car: { userID } }
            });
            if (!response) {
                throw {
                    status: 400,
                    message: "The image doesn't exist, or you don't have permission to delete it!"
                };
            }
            return {
                status: 200,
                message: "Successfully deleted!"
            };
        }
        catch (err) {
            logger(err, "CarImagesModel", "deleteImage");
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving images."
            };
        }
    }
}
export default CarImagesModel;
