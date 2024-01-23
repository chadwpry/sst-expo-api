import { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardFooter,
  H4,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
} from '@components';
import { Droplets, Eye, Smile, Stethoscope, Syringe } from '@tamagui/lucide-icons';

import * as TodoService from '@services/Todo';

export default function TodoListScreen() {
  const [todos, setTodos] = useState<TodoService.TodoType[]>();

  useEffect(() => {
    const onLoad = async () => {
      const list = await TodoService.list();

      setTodos(list);
    }

    onLoad();
  }, []);

  const iconForTodo = (item: TodoService.TodoType) => {
    if (['Blood Collection', 'Stool Collection', 'Urine Collection'].includes(item.title)) {
      return <Droplets />;
    } else if (['Vaccination', 'Tissue Biopsy'].includes(item.title)) {
      return <Syringe />;
    } else if (['Annual Physical Exam', 'Dermatological Exam', 'General Physical'].includes(item.title)) {
      return <Stethoscope />;
    } else if (['Annual Dental Exam', 'Dental Cleaning'].includes(item.title)) {
      return <Smile />;
    } else if (['Yearly Eye Checkup'].includes(item.title)) {
      return <Eye />;
    }
  }

  const colorForTitle = (item: TodoService.TodoType) => {
    if (['Blood Collection', 'Stool Collection', 'Urine Collection'].includes(item.title)) {
      return "#e63946";
    } else if (['Vaccination', 'Tissue Biopsy'].includes(item.title)) {
      return "#D2F047";
    } else if (['Annual Physical Exam', 'Dermatological Exam', 'General Physical'].includes(item.title)) {
      return "#219ebc";
    } else if (['Annual Dental Exam', 'Dental Cleaning'].includes(item.title)) {
      return "#ffb703";
    } else if (['Yearly Eye Checkup'].includes(item.title)) {
      return "#8ecae6";
    }
  }

  return (
    <View>
      {todos ? (
        <ScrollView>
          {todos.map((item: TodoService.TodoType, index: number) => (
            <Card br="$4" key={`card-${index}`} mb="$4">
              <CardHeader bc={colorForTitle(item)} btlr="$4" btrr="$4" pl="$4" pr="$4" pt="$2" pb="$2">
                <XStack flex={1} ai="center" jc="space-between">
                  <H4>{item.title}</H4>

                  {iconForTodo(item)}
                </XStack>
              </CardHeader>
              <CardFooter bblr="$4" bbrr="$4" padded>
                <Text>{item.subtitle}</Text>
              </CardFooter>
            </Card>
          ))}
        </ScrollView>
      ): (
        <Spinner size="large" />
      )}
    </View>
  );
}
