import { TransitMode } from "@prisma/client";

/**
 * 文字列からTransitModeへのキャスト関数
 * @param method
 */
export function mapMethodToTransitMode(method: string): TransitMode {
    switch (method.toLowerCase()) {
        case "walk":
            return TransitMode.WALK;
        case "train":
            return TransitMode.TRAIN;
        case "bus":
            return TransitMode.BUS;
        case "car":
            return TransitMode.CAR;
        case "bike":
            return TransitMode.BIKE;
        case "flight":
            return TransitMode.FLIGHT;
        case "ship":
            return TransitMode.SHIP;
        case "other":
            return TransitMode.OTHER;
        default:
            return TransitMode.WALK;
    }
}
