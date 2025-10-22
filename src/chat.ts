import { Agent, run, tool, webSearchTool } from "@openai/agents";
import axios from "axios";
import "dotenv/config";
import z from "zod";

const getCurrentTime = tool({
  name: "get_current_time",
  description: "This tool fetches current time",
  parameters: z.object({}),
  async execute() {
    return new Date().toString();
  },
});

const getWeatherDetailsByCity = tool({
  name: "get_weather_details_by_city",
  description: "This tool fetches weather details by city name",
  parameters: z.object({
    cityName: z.string(),
  }),
  async execute({ cityName }) {
    const url = `https://wttr.in/${cityName.toLowerCase()}?format=%C+%t`;
    const { data } = await axios.get(url, { responseType: "json" });
    return `The current weather for ${cityName} is ${data}`;
  },
});

export async function chat(messages: any) {
  const agent = new Agent({
    name: "chat-agent",
    instructions: "You are a helpful assistant.",
    model: "gpt-4.1-mini",
    tools: [getCurrentTime, getWeatherDetailsByCity, webSearchTool()],
  });

  console.log("agent: ", agent);

  const result = await run(agent, messages);

  console.log(result.finalOutput);

  return;
}

chat("can tell what this website is about? https://supertokens.com/");
