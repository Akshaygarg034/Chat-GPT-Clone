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
        onChange={onChange}
      />
    </div>
  )
}

export default ModelSelection
