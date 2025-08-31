import transformerDirectives from '@unocss/transformer-directives'
import {
  defineConfig,
  presetAttributify,
  presetUno,
  transformerVariantGroup,
  transformerAttributifyJsx,
} from 'unocss'

export default defineConfig({
  presets: [presetAttributify(), presetUno()],
  transformers: [transformerVariantGroup(), transformerDirectives(), transformerAttributifyJsx()],
  theme: {},
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-col-center': 'flex flex-col justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'flex-start': 'flex justify-start items-center',
      'border-r-gray-200': 'border-r-1px border-r-solid border-gray-200',
      borderGray: 'border-1px border-solid border-gray-200',
    },
  ],
})
