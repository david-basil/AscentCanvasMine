export type Constraint = {
    'mustBeInteger': boolean,
    'lowerBound'?: number,
    'upperBound'?: number,
}

/**
 * Return whether a number whose constraint is `constraintToCheck` would
 * also satisfy the constraint of `constraintToFit`.
 * @param constraintToCheck The constraint that needs to satisfy `constraintToFit`.
 * @param constraintToFit The constraint whose conditions need to be met.
 */
export function fitsConstraint(
    constraintToCheck: Constraint | undefined, 
    constraintToFit: Constraint | undefined,
): boolean {
    if(!constraintToFit) return true;
    if(constraintToFit.mustBeInteger) {
        if(!constraintToCheck) return false;
        if(!constraintToCheck.mustBeInteger) return false;
    }

    if(constraintToFit.lowerBound) {
        if(!constraintToCheck) return false;
        if(constraintToCheck.lowerBound === undefined) return false;
        if(constraintToCheck.lowerBound < constraintToFit.lowerBound) return false;
    }

    if(constraintToFit.upperBound) {
        if(!constraintToCheck) return false;
        if(constraintToCheck.upperBound === undefined) return false;
        if(constraintToCheck.upperBound > constraintToFit.upperBound) return false;
    }

    return true;
}

/**
 * Return the tightest possible constraint that the `value` satisfies
 */
export function getMaximalConstraint(value: number): Constraint {
    return {
        'mustBeInteger': Number.isInteger(value),
        'lowerBound': value,
        'upperBound': value,
    }
}