'use client'
import useSWR from 'swr'
import Select from 'react-select'

const fetchModels = () => fetch('/api/getEngines').then(res => res.json())

function ModelSelection() {
    const { data: models, isLoading } = useSWR('models', fetchModels)
    const { data: model, mutate: setModel } = useSWR('model')

    const onChange = (selected: any) => {
        setModel(selected.value)
    }

    // derive current selected model: either stored in SWR, or first one from API
    const currentModel = model || models?.modelOptions?.[0]?.value

    return (
        <div className="mt-2">
            <Select
                className="mt-2"
                options={models?.modelOptions}
                isSearchable
                isLoading={isLoading}
                menuPosition="fixed"
                classNames={{
                    control: () => "bg-[#202022] border-[#434654]",
                }}
                value={
                    models?.modelOptions?.find((m: any) => m.value === currentModel) ||
                    null
                }
                placeholder="Select a model"
                styles={{
                    control: (base) => ({
                        ...base,
                        backgroundColor: "#202022",
                        borderColor: "#434654",
                        minHeight: "40px",
                        boxShadow: "none",
                        "&:hover": {
                            borderColor: "#434654",
                        },
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: "#8e8e8e",
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: "#e5e5e5",
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: "#242424",
                        border: "1px solid #434654",
                        zIndex: 50,
                    }),
                    menuList: (base) => ({
                        ...base,
                        maxHeight: "200px",
                        overflowY: "auto",
                        // thin scrollbar styles
                        scrollbarWidth: "thin", // Firefox
                        scrollbarColor: "#434654 transparent", // Firefox (thumb + track)
                        "&::-webkit-scrollbar": {
                            width: "6px", // thin width
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#434654", // dark gray thumb
                            borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "transparent", // no background track
                        },
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? "#333333" : "transparent",
                        color: "#e5e5e5",
                        cursor: "pointer",
                    }),
                    dropdownIndicator: (base) => ({
                        ...base,
                        color: "#8e8e8e",
                        "&:hover": {
                            color: "#e5e5e5",
                        },
                    }),
                    indicatorSeparator: () => ({
                        display: "none",
                    }),
                }}
                onChange={onChange}
            />

        </div>
    )
}

export default ModelSelection
