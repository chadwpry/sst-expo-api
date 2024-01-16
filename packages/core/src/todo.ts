export * as Todo from "./todo";

import { addDays, subDays } from "date-fns";
import { faker } from '@faker-js/faker';
import { z } from "zod";

import { byField, DESCENDING } from "./comparators";
import { event } from "./event";

export type TodoType = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  dueDate: Date;
  startDate: Date;
  completeDate: Date;
}

export const TodoSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  dueDate: z.date(),
  startDate: z.date().nullable(),
  completeDate: z.date().nullable(),
});

export const Events = {
  Created: event("todo.created", TodoSchema),
};

export async function create() {
  const id = faker.string.uuid();
  const type = createType();
  const title = createTitle(type);
  const subtitle = '';

  const dueDate = createDueDate(new Date);
  const startDate = createStartDate(dueDate);
  const completeDate = createStartDate(startDate);

  await Events.Created.publish({
    id,
    type,
    title,
    subtitle,
    dueDate,
    startDate,
    completeDate,
  });
}

const createType = () => {
  const list = [
    "MedicalCollection",
    "MedicalAppointment",
  ];

  return list[Math.floor(Math.random() * list.length)];
}

const createTitle = (type: string) => {
  let list: any[];

  if (type === "MedicalCollection") {
    list = [
      "Blood Collection",
      "Urine Collection",
      "Stool Collection",
      "Tissue Biopsy",
    ];
  } else if (type === "MedicalAppointment") {
    list = [
      "General Physical",
      "Annual Physical Exam",
      "Yearly Eye Checkup",
      "Vaccination",
      "Dermatological Exam",
      "Dental Cleaning",
      "Annual Dental Exam",
    ];
  } else {
    list = [];
  }

  return list[Math.floor(Math.random() * list.length)];
}

const createSubtitle = (title: string) => {
  return faker.lorem.words({
    min: 2,
    max: 6,
  })
}

const createDueDate = (today: Date) => {
  return faker.date.between({
    from: subDays(today, 30),
    to: addDays(today, 30),
  });
}

const createStartDate = (due: Date) => {
  const today = new Date;

  // Past
  if (due < today) {
    return faker.date.between({
      from: subDays(due, 10),
      to: today,
    });
  } else if (due > today) {
    return faker.date.between({
      from: subDays(today, 10),
      to: today,
    });
  } else {
    return faker.date.between({
      from: subDays(today, 10),
      to: today,
    });
  }
}

const createCompleteDate = (start: Date) => {
  const today = new Date;

  // Past
  if (start < today) {
    return faker.date.between({
      from: start,
      to: today,
    });
  } else {
    return;
  }
}

export function list() {
  return Array(15)
    .fill(0)
    .map((_element, _index) => {
      const id = faker.string.uuid();
      const type = createType();
      const title = createTitle(type);
      const subtitle = createSubtitle(title);

      const dueDate = createDueDate(new Date);
      const startDate = createStartDate(dueDate);
      const completeDate = createCompleteDate(startDate);

      return {
        id,
        type,
        title,
        subtitle,
        dueDate,
        startDate,
        completeDate,
      };
    })
    .sort(byField('dueDate', DESCENDING));
}
