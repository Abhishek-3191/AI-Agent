import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values";
export default defineSchema({
UserTable:defineTable({
    name:v.string(),
    email:v.string(),
    imageUrl:v.optional(v.string()),
    subsription:v.optional(v.string()),
    token:v.number()
})
,
AgentTable:defineTable({
    name:v.string(),
    agentId:v.string(),
    config:v.optional(v.any()),
    nodes:v.optional(v.any()),
    edges:v.optional(v.any()),
    published:v.boolean(),
    userId:v.id('UserTable'),
    agentToolConfig:v.optional(v.any())
})
})
