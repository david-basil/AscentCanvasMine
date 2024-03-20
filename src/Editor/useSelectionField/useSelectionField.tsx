import React, { useState } from "react";

export function useSelectionField(
    options: {[k: string]: React.JSX.Element},
    defaultOption: string,
    onSelect: (k: string) => void = (() => {})
) {
    const [currRender, setCurrRender] = useState<React.JSX.Element>(options[defaultOption])

    const handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
        const selectedOption = e.currentTarget.options[e.currentTarget.selectedIndex].value
        setCurrRender(options[selectedOption])
        onSelect(selectedOption)
    }

    const selectRender = (
        <select onChange={handleChange} defaultValue={defaultOption}> {
            Object.entries(options)
                .map(([key, _]) => <option key={key} value={key}>{key}</option>)
        } </select>
    )

    return <>{selectRender} {currRender}</>
}