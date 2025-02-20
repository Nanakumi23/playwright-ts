import { test, expect } from '@playwright/test';
import * as data from '../testData.json';


// Defining types for the JSON structure
interface Task {
  Task: string;
  Tags: string | string[];
}

interface Section {
  "To Do": Task[];
  "In Progress"?: Task[];
  "Done"?: Task[];
}

interface Data {
  "Web Application": Section;
  "Mobile Application": Section;
}

// Using the imported JSON data
const jsonData: Data = data;

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('textbox', { name: 'Username' }).fill("admin")
  await page.getByRole('textbox', { name: 'Password' }).fill("password123")
  await page.getByRole('button', { name: 'Sign in' }).click()
})

// Helper function to iterate over sections and tasks
const iterateTasks = (section: Section, sectionName: string) => {
  for (const [status, tasks] of Object.entries(section)) {
    tasks.forEach(task => {
      test(`${sectionName} - ${status} - ${task.Task}`, async ({ page }) => {
        if (sectionName.includes("Web Application")) {
          await page.getByRole('button', { name: 'Web Application Main web' }).click()
        }
        else if (sectionName.includes("Mobile Application")) {
          await page.getByRole('button', { name: 'Mobile Application Native' }).click()
        }
        await expect(page.locator(`//h2[text()='${status}']`)).toBeVisible()
        await expect(page.locator(`//h3[text()='${task.Task}']`)).toBeVisible()
        for(let i=0;i<task.Tags.length;i++)
        await expect(page.locator(`//h2[text()='${status}']/following-sibling::div//div//span[contains(@class,'rounded-full') and text()='${task.Tags[i]}']`)).toBeVisible()
      });
    });
  }
};

// Iterate over Web Application tasks
iterateTasks(jsonData["Web Application"], "Web Application");

// Iterate over Mobile Application tasks
iterateTasks(jsonData["Mobile Application"], "Mobile Application");
