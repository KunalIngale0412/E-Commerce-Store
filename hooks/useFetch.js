import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const useFetch = (url, method='GET', options={}) => {

    // You can implement your fetch logic here using useEffect and useState
    const [data,setData]= useState(null)
    const [loading,setLoading]= useState(false)
    const [error,setError]= useState(null)
    const [refreshIndex,setRefreshIndex]= useState(0)


    const optionsSting = JSON.stringify(options)
    const requestOptions = useMemo(() => {
        const opts = {...options}
        if (method !== 'POST' && !opts.data) {
            opts.data = {}
        }
        return opts
    }, [method, optionsSting] )

    useEffect(() => {
        const apiCall = async () => {
            setLoading(true)
            setError(null)
            try {
                const {data : response }= await axios({
                    url,
                    method,
                    ...(requestOptions)
                })
                if(!response.success){
                   throw new Error(response.message)
                }


                setData(response)
            } catch (error) {
               setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        apiCall()

    }, [url,  refreshIndex, requestOptions])


    const refetch = () => {
        setRefreshIndex(prev => prev + 1)
    }
    return {data, loading, error, refetch}
}


export default useFetch