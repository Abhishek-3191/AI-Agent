"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { FileJson } from 'lucide-react';

function ApiAgentSettings({ selectedNode, updateFormData }: any) {
  const [formData, setFormData] = useState({
    name: '',
    method: 'GET',
    url: '',
    apiKey: '',
    includeApiKey: true,
    bodyParams: ""   // 🔥 CHANGED TO STRING → fixes controlled/uncontrolled issue
  });

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      // 🔥 Ensure bodyParams is ALWAYS a string
      const settings = selectedNode.data.settings;
      setFormData({
        ...settings,
        bodyParams: typeof settings.bodyParams === "string"
          ? settings.bodyParams
          : JSON.stringify(settings.bodyParams || {}, null, 2)
      });
    }
  }, [selectedNode]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value ?? "" // 🔥 ensures input never becomes undefined
    }))
  }

  const onSave = () => {
    console.log(formData);
    updateFormData(formData);
    toast.success("API Agent Settings Updated!");
  }

  return (
    <div>
      <h2 className='font-bold'>API Agent</h2>
      <p className='text-gray-500 mt-1'>
        Call an external API endpoint with your chosen method
      </p>

      {/* Name */}
      <div className='mt-3 space-y-1'>
        <Label>Agent Name</Label>
        <Input
          placeholder='API Agent Name'
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      {/* Method */}
      <div className='mt-3 space-y-1'>
        <Label>Request Method</Label>
        <Select
          value={formData.method}
          onValueChange={(value) => handleChange('method', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select Method' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='GET'>GET</SelectItem>
            <SelectItem value='POST'>POST</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* URL */}
      <div className='mt-3 space-y-1'>
        <Label>API URL</Label>
        <Input
          placeholder='https://api.example.com/data'
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
        />
      </div>

      {/* API Key Toggle */}
      <div className='mt-3 flex justify-between items-center'>
        <Label>Include API Key</Label>
        <Switch
          checked={formData.includeApiKey}
          onCheckedChange={(checked) => handleChange('includeApiKey', checked)}
        />
      </div>

      {/* API Key */}
      {formData.includeApiKey && (
        <div className='mt-3 space-y-1'>
          <Label>Enter API Key</Label>
          <Input
            type='password'
            placeholder='Enter API Key'
            value={formData.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
          />
        </div>
      )}

      {/* Body Params (POST ONLY) */}
      {formData.method === "POST" && (
        <div className="mt-5 space-y-1">
          <Label>Body Parameters (JSON)</Label>

          <Textarea
            placeholder='{"param1": "value1", "param2": "value2"}'
            value={formData.bodyParams}
            onChange={(e) => handleChange("bodyParams", e.target.value)}
          />

          <h2 className="text-sm flex gap-2 items-center cursor-pointer">
            Add Body Params <FileJson className='h-3 w-3' />
          </h2>
        </div>
      )}

      <Button className='w-full mt-5' onClick={onSave}>Save</Button>
    </div>
  )
}

export default ApiAgentSettings;
