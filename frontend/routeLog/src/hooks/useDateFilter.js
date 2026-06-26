import { useContext } from 'react'
import DateFilterContext  from '../context/DateFilterContext'

export default function useDateFilter() { 
    return useContext(DateFilterContext)
}