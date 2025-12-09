import { logger } from "../framework/functions.js";
import Model from "./Model.js";
import { Car } from "./types.js";
import { HTTPResponse } from "./types.js";

class CarModel extends Model<"car"> {
    constructor() {
        super("car", ["userID", "title", "make", "model", "description"]);
    }

    // CREATE
    async createCar(car: Car): Promise<HTTPResponse> {
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
        } catch (err: any) {
            logger(err, "CarModel", "createCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error creating car."
            };
        }
    }

    // READ - egy autó lekérdezése ID alapján a fő képpel, ha van
    async getCar(carID: number, userID: number): Promise<Car & { mainImage?: string | null }> {
        try {
            const car: any = await this.model.findUnique({
                where: { carID, userID },
                include: {
                    images: {
                        where: { isMain: true },
                        select: { path: true }, // vagy 'url', ha a mező neve így van
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
        } catch (err: any) {
            if (!err.status) logger(err, "CarModel", "getCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving car."
            };
        }
    }

    async getCarPublic(carID: number): Promise<Car & { mainImage?: string | null }> {
        try {
            const car: any = await this.model.findUnique({
                where: { carID },
                include: {
                    images: {
                        where: { isMain: true },
                        select: { path: true }, // vagy 'url', ha a mező neve így van
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
        } catch (err: any) {
            if (!err.status) logger(err, "CarModel", "getCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving car."
            };
        }
    }

    // READ - felhasználóhoz tartozó autók a fő képpel, de ha nincs kép, akkor is visszaadja az autót
    async getCarsByUser(userID: number): Promise<(Car & { mainImage?: string | null })[]> {
        try {
            const cars: any = await this.model.findMany({
                where: { userID },
                include: {
                    images: {
                        where: { isMain: true },
                        select: { path: true },
                        take: 1
                    }
                }
            });

            return cars.map((car: any) => {
                const mainImage = car.images[0]?.path ?? null;
                const { images, ...rest } = car;
                return { ...rest, mainImage };
            });
        } catch (err: any) {
            logger(err, "CarModel", "getCarsByUser");
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving cars."
            };
        }
    }


    // UPDATE
    async updateCar(carID: number, car: Partial<Car>): Promise<HTTPResponse> {
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
        } catch (err: any) {
            logger(err, "CarModel", "updateCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error updating car."
            };
        }
    }

    // DELETE
    async deleteCar(carID: number): Promise<HTTPResponse> {
        try {
            const deletedCar = await this.model.delete({
                where: { carID }
            });

            if (!deletedCar) {
                throw { status: 404, message: "Car not found." };
            }

            return { status: 200, message: "Car deleted successfully." };
        } catch (err: any) {
            logger(err, "CarModel", "deleteCar");
            throw {
                status: err.status || 500,
                message: err.message || "Error deleting car."
            };
        }
    }

    async getAllMakesAndModels(): Promise<{ makes: string[]; models: string[] }> {
        try {
            // Egyedi make-ek lekérése
            const makesData = await this.model.findMany({
                select: { make: true },
                distinct: ["make"]
            });
            const makes = makesData.map(m => m.make);

            // Egyedi model-ek lekérése
            const modelsData = await this.model.findMany({
                select: { model: true },
                distinct: ["model"]
            });
            const models = modelsData.map(m => m.model);

            return { makes, models };
        } catch (err: any) {
            logger(err, "CarModel", "getAllMakesAndModels");
            throw {
                status: err.status || 500,
                message: err.message || "Error retrieving makes and models."
            };
        }
    }


    // 2. Keresés autókra make, model és description alapján
    async searchCars(params: {
        make?: string;
        model?: string;
        keyword?: string;
    }): Promise<(Car & { mainImage?: string | null })[]> {
        try {
            const { make, model, keyword } = params;

            const cars: any = await this.model.findMany({
                where: {
                    AND: [
                        make ? { make: { contains: make } } : {},
                        model ? { model: { contains: model } } : {},
                        keyword ? { description: { contains: keyword } } : {}
                    ]
                },
                include: {
                    images: {
                        where: { isMain: true },
                        select: { path: true },
                        take: 1
                    }
                }
            });

            return cars.map((car: any) => {
                const mainImage = car.images[0]?.path ?? null;
                const { images, ...rest } = car;
                return { ...rest, mainImage };
            });
        } catch (err: any) {
            logger(err, "CarModel", "searchCars");
            throw {
                status: err.status || 500,
                message: err.message || "Error searching cars."
            };
        }
    }
}

export default CarModel;