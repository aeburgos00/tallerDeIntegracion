import {
  createContext,
  useState
} from 'react'


import dayjs from 'dayjs'
import "dayjs/locale/es";
dayjs.locale("es")
import weekday from "dayjs/plugin/weekday"
dayjs.extend(weekday)

const DateFilterContext = createContext()

export function DateFilterProvider({ children }) 
{
  const [fechaDesde, setFechaDesde] = useState( 
    dayjs().weekday(0)
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