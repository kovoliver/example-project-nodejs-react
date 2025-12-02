import { logger } from "../framework/functions.js";
import Model from "./Model.js";
class CarModel extends Model {
    constructor() {
        super("car", ["userID", "title", "make", "model", "description"]);
    }
    // CREATE
    async createCar(car) {
        try {
            const newCar = await this.model.create({
                data: {
                    userID: car.userID,
                    title: car.title ?? undefined,
                    make: car.make,
                    model: car.model,
                    description: car.description ?? undefined
                }
            });
            return {
                status: 201,
                message: "Car created successfully.",
                insertID: newCar.carID
            };
        }
        catch (err) {
            logger(err, "CarModel", "createCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error creating car."
            };
        }
    }
    // READ - egy autó lekérdezése ID alapján a fő képpel, ha van
    async getCar(carID, userID) {
        try {
            const car = await this.model.findUnique({
                where: { carID, userID },
                include: {
                    images: {
                        where: { isMain: true },
                        select: { path: true },
                        take: 1
                    }
                }
            });
            if (!car) {
                throw { status: 404, message: "Car not found." };
            }
            const mainImage = car.images[0]?.path ?? null;
            const { images, ...rest } = car;
            return { ...rest, mainImage };
        }
        catch (err) {
            if (!err.status)
                logger(err, "CarModel", "getCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving car."
            };
        }
    }
    // READ - felhasználóhoz tartozó autók a fő képpel, de ha nincs kép, akkor is visszaadja az autót
    async getCarsByUser(userID) {
        try {
            const cars = await this.model.findMany({
                where: { userID },
                include: {
                    images: {
                        where: { isMain: true },
                        select: { path: true },
                        take: 1
                    }
                }
            });
            return cars.map((car) => {
                const mainImage = car.images[0]?.path ?? null;
                const { images, ...rest } = car;
                return { ...rest, mainImage };
            });
        }
        catch (err) {
            logger(err, "CarModel", "getCarsByUser");
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving cars."
            };
        }
    }
    // UPDATE
    async updateCar(carID, car) {
        try {
            const updatedCar = await this.model.update({
                where: { carID },
                data: {
                    title: car.title ?? undefined,
                    make: car.make,
                    model: car.model,
                    description: car.description ?? undefined
                }
            });
            if (!updatedCar) {
                throw { status: 404, message: "Car not found." };
            }
            return { status: 200, message: "Car updated successfully." };
        }
        catch (err) {
            logger(err, "CarModel", "updateCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error updating car."
            };
        }
    }
    // DELETE
    async deleteCar(carID) {
        try {
            const deletedCar = await this.model.delete({
                where: { carID }
            });
            if (!deletedCar) {
                throw { status: 404, message: "Car not found." };
            }
            return { status: 200, message: "Car deleted successfully." };
        }
        catch (err) {
            logger(err, "CarModel", "deleteCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error deleting car."
            };
        }
    }
}
export default CarModel;
