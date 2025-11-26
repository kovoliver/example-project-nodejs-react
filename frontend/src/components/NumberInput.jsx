import { useState } from "react";
import { isNumeric } from "../app/functions";

export default ({ value, setValue, classes, name, from = -10000000, to = 10000000, digits = 0 }) => {
    // Alapértelmezett string érték 0.0 / 0.00 / ...
    const defaultValue = digits > 0 ? `0.${"0".repeat(digits)}` : "0";

    const changeVal = (v) => {
        if (v === "") {
            setValue(defaultValue);
            return;
        }

        const arrValue = v.split(".");

        // Ha túl sok pont van, kilépünk
        if (arrValue.length > 2) return;

        // Az első rész szám legyen
        if (!isNumeric(arrValue[0])) return;

        // Ha van tizedes, az lehet üres vagy szám
        if (arrValue.length === 2 && arrValue[1] !== "" && !isNumeric(arrValue[1])) return;

        // Tizedesjegyek korlátozása
        if (arrValue[1] && arrValue[1].length > digits) return;

        // Számként ellenőrzés min/max
        const numValue = parseFloat(v);
        if (!isNaN(numValue)) {
            if (numValue < from) return;
            if (numValue > to) return;
        }

        setValue(v);
    };

    return (
        <input
            type="text"
            name={name}
            value={value}
            onChange={(e) => changeVal(e.target.value)}
            className={classes.join(" ")}
        />
    );
};
