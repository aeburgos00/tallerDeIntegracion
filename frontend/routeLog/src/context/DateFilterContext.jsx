import {
  createContext,
  useState
} from 'react'

import dayjs from 'dayjs'

const DateFilterContext = createContext()

export function DateFilterProvider({ children }) 
{
  const [fechaDesde, setFechaDesde] = useState( 
    dayjs().startOf('week')
  )
  const [fechaHasta, setFechaHasta] = useState( 
    dayjs() 
  )

  return (
    <DateFilterContext.Provider
      value={{
        fechaDesde,
        fechaHasta,
        setFechaDesde,
        setFechaHasta
      }}
    >
      {children}
    </DateFilterContext.Provider>
  )
}

export default DateFilterContext