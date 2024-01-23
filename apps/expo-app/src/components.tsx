import {
  styled,
  Avatar as TgAvatar,
  Button as TgButton,
  Card as TgCard,
  CardHeader as TgCardHeader,
  CardFooter as TgCardFooter,
  H2 as TgH2,
  H3 as TgH3,
  H4 as TgH4,
  Input as TgInput,
  Label as TgLabel,
  ScrollView as TgScrollView,
  Spinner as TgSpinner,
  Text as TgText,
  View as TgView,
  XStack as TgXStack,
  YStack as TgYStack,
} from 'tamagui';

export const Avatar = styled(TgAvatar, {
  circular: true,
  size: "$3",
})

export const Button = styled(TgButton, {
})

export const Card = styled(TgCard, {
})

export const CardHeader = styled(TgCardHeader, {
})

export const CardFooter = styled(TgCardFooter, {
})

export const H2 = styled(TgH2, {
  fontWeight: "normal",
})

export const H3 = styled(TgH3, {
})

export const H4 = styled(TgH4, {
})

export const Input = styled(TgInput, {
  fontSize: "$5",
  size: "$6",
})

export const Label = styled(TgLabel, {
  fontSize: "$5",
})

export const ScrollView = styled(TgScrollView, {
  height: "100%",
  pt: "$6",
  showsVerticalScrollIndicator: false,
  width: "100%",
})

export const Spinner = styled(TgSpinner, {
})

export const Text = styled(TgText, {
})

export const View = styled(TgView, {
  alignItems: "center",
  backgroundColor: "#ffffff",
  justifyContent: "center",
  h:"100%",
  w: "100%",
})

export const XStack = styled(TgXStack, {
})

export const YStack = styled(TgYStack, {
})