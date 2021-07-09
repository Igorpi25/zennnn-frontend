import axios from 'axios'
import { ref, onBeforeMount } from 'vue'
import { logger } from '@/plugins'

export function useCurrencyRates(initialFetch = true) {
  const currencyRates = ref<Record<string, number>>({})

  async function getRates() {
    try {
      const response = await axios.get(
        'https://api.exchangeratesapi.io/latest?base=USD&symbols=USD,CNY,HKD,RUB,EUR,GBP'
      )
      if (response.data && response.data.success) {
        currencyRates.value = response.data.rates
      }
    } catch (error) {
      logger.info('Error on get currency rates', error)
    }
  }

  onBeforeMount(() => {
    if (initialFetch) getRates()
  })

  return {
    currencyRates,
    refetch: getRates,
  }
}
