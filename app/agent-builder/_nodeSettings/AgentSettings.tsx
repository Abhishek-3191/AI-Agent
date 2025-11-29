import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { FileJson } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

function AgentSettings({ selectedNode, updateFormData }: any) {

  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
    includeHistory: true,
    model: 'gemini-flash-1.5',
    output: 'text',
    schema: ''
  });

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    }
  }, [selectedNode]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const onSave = () => {
    updateFormData(formData);
    toast.success("Settings updated!");
  };

  return (
    <div>
      <h2 className="font-bold mt-2">Agent</h2>
      <p className="text-gray-500 mt-2">Call the AI model</p>

      <div className="mt-3 space-y-1">
        <Label>Name</Label>
        <Input
          placeholder="Agent Name"
          value={formData.name}
          onChange={(event) => handleChange('name', event.target.value)}
        />
      </div>

      <div className="mt-3 space-y-1">
        <Label>Instructions</Label>
        <Textarea
          placeholder="Give Instructions"
          value={formData.instructions}
          onChange={(event) => handleChange('instructions', event.target.value)}
        />
        <h2 className="text-sm p-1 flex gap-2 items-center">
          Add Context <FileJson />
        </h2>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <Label>Include Chat History</Label>
        <Switch
          checked={formData.includeHistory}
          onCheckedChange={(checked) => handleChange('includeHistory', checked)}
        />
      </div>

      <div className="mt-3 flex justify-between items-center">
        <Label>Model</Label>
        <Select
          value={formData.model}
          onValueChange={(value) => handleChange('model', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="gemini-flash-1.5">Gemini Flash 1.5</SelectItem>
            <SelectItem value="gemini-pro-1.5">Gemini Pro 1.5</SelectItem>
            <SelectItem value="gemini-pro-2.0">Gemini Pro 2.0</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 space-y-2">
        <Label>Output</Label>

        <Tabs
          defaultValue="text"
          value={formData.output}
          onValueChange={(value) => handleChange('output', value)}
          className="w-[400px]"
        >
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="json">Json</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <h2 className="text-sm text-gray-500">Output will be text</h2>
          </TabsContent>

          <TabsContent value="json">
            <h2 className="text-sm text-gray-500 mb-1">Output will be JSON</h2>
            <Label className="text-sm text-gray-500">Enter the JSON Schema</Label>
            <Textarea
              placeholder='{ "title": "string" }'
              className="max-w-[300px] mt-1"
              value={formData.schema}
              onChange={(event) => handleChange('schema', event.target.value)}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Button className="w-full mt-5" onClick={onSave}>
        Save
      </Button>
    </div>
  );
}

export default AgentSettings;
