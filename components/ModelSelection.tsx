'use client'
import useSWR from 'swr'
import Select, { components } from 'react-select'

const fetchModels = () => fetch('/api/getEngines').then(res => res.json())

function ModelSelection() {
    const { data: models, isLoading } = useSWR('models', fetchModels)
    const { data: model, mutate: setModel } = useSWR('model')

    const onChange = (selected: any) => {
        if (selected?.isDisabled) return
        setModel(selected.value)
    }

    const currentModel = model || models?.modelOptions?.[0]?.value

    const CustomOption = (props: any) => {
        const { data } = props
        return (
            <components.Option {...props}>
                <div className="flex items-center justify-between w-full">
                    <span>{data.label}</span>
                    {data.isDisabled && (
                        <span className="text-[10px] font-medium bg-[#3a3a3a] text-[#888] px-1.5 py-0.5 rounded ml-2">
                            COMING SOON
                        </span>
                    )}
                </div>
            </components.Option>
        )
    }

    return (
        <div className="mt-2">
            <Select
                className="mt-2"
                options={models?.modelOptions}
                isSearchable={false}
                isLoading={isLoading}
                menuPosition="fixed"
                isOptionDisabled={(option: any) => option.isDisabled}
                components={{ Option: CustomOption }}
                value={
                    models?.modelOptions?.find((m: any) => m.value === currentModel) ||
                    null
                }
                placeholder="Select a model"
                styles={{
                    control: (base) => ({
                        ...base,
                        backgroundColor: "#2f2f2f",
                        borderColor: "#424242",
                        minHeight: "40px",
                        boxShadow: "none",
                        "&:hover": {
                            borderColor: "#555",
                        },
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: "#888",
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: "#e5e5e5",
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: "#2f2f2f",
                        border: "1px solid #424242",
                        zIndex: 50,
                    }),
                    menuList: (base) => ({
                        ...base,
                        maxHeight: "200px",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#424242 transparent",
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? "#3a3a3a" : "transparent",
                        color: state.isDisabled ? "#666" : "#e5e5e5",
                        cursor: state.isDisabled ? "not-allowed" : "pointer",
                        opacity: state.isDisabled ? 0.6 : 1,
                    }),
                    dropdownIndicator: (base) => ({
                        ...base,
                        color: "#888",
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
