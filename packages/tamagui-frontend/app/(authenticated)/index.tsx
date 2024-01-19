import { useEffect, useState } from 'react';
import { Card, H4, ScrollView, Spinner, Text, View, XStack } from 'tamagui'
import { Droplets, Stethoscope, Syringe } from '@tamagui/lucide-icons'
import FontAwesome from '@expo/vector-icons/FontAwesome';

import * as TodoService from '@/services/Todo';

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
      return <Droplets color="#ffffff" />;
    } else if (['Vaccination', 'Tissue Biopsy'].includes(item.title)) {
      return <Syringe color="#ffffff" />;
    } else if (['Annual Physical Exam', 'Dermatological Exam', 'General Physical'].includes(item.title)) {
      return <Stethoscope color="#ffffff" />;
    } else if (['Annual Dental Exam', 'Dental Cleaning'].includes(item.title)) {
      return <FontAwesome color="#ffffff" name="smile-o" size={24} />;
    } else if (['Yearly Eye Checkup'].includes(item.title)) {
      return <FontAwesome color="#ffffff" name="eye" size={28} />;
    }
  }

  const colorForTitle = (item: TodoService.TodoType) => {
    if (['Blood Collection', 'Stool Collection', 'Urine Collection'].includes(item.title)) {
      return "#e63946";
    } else if (['Vaccination', 'Tissue Biopsy'].includes(item.title)) {
      return "#023047";
    } else if (['Annual Physical Exam', 'Dermatological Exam', 'General Physical'].includes(item.title)) {
      return "#219ebc";
    } else if (['Annual Dental Exam', 'Dental Cleaning'].includes(item.title)) {
      return "#ffb703";
    } else if (['Yearly Eye Checkup'].includes(item.title)) {
      return "#8ecae6";
    }
  }

  return (
    <View alignItems="center" justifyContent="center" h="100%" w="100%">
      {todos ? (
        <ScrollView height="100%" mt="$0" pt="$6" width="100%">
          {todos.map((item: TodoService.TodoType, index: number) => (
            <Card bg="#ffffff" br="$4" bordered key={`card-${index}`} mb="$4" ml="$3" mr="$3">
              <Card.Header bc={colorForTitle(item)} btlr="$4" btrr="$4" pl="$4" pr="$4" pt="$2" pb="$2">
                <XStack flex={1} ai="center" jc="space-between">
                  <H4 color="#ffffff">{item.title}</H4>

                  {iconForTodo(item)}
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <Text>{item.subtitle}</Text>
              </Card.Footer>
            </Card>
          ))}
        </ScrollView>
      ): (
        <Spinner size="large" color="$orange10" />
      )}
    </View>
  );
}
