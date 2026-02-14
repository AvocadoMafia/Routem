import { TransitMode } from "@prisma/client";

/**
 * 文字列からTransitModeへのキャスト関数
 * @param method
 */
export function mapMethodToTransitMode(method: string): TransitMode {
    switch (method.toUpperCase()) {
        case "WALK":
            return TransitMode.WALK;
        case "TRAIN":
            return TransitMode.TRAIN;
        case "BUS":
            return TransitMode.BUS;
        case "CAR":
            return TransitMode.CAR;
        case "BIKE":
            return TransitMode.BIKE;
        case "FLIGHT":
            return TransitMode.FLIGHT;
        case "SHIP":
            return TransitMode.SHIP;
        case "OTHER":
            return TransitMode.OTHER;
        default:
            return TransitMode.WALK;
    }
}
