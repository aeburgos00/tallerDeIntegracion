import pool from '../config/db.js'

export const obtenerLiquidacionesTotales = async (req, res) => {
    const {
        desde,
        hasta
    } = req.query

    try {
        const query = `
            select
                count(aux.paquete) total_envios,
                coalesce(sum(aux.valor),0) as valor_total,
                count(aux.liquidacion) envios_liquidados,
                coalesce(sum(aux.valor_liq),0) as valor_liquidado,
                case when count(aux.paquete) > 0 then
                    (count(aux.liquidacion)::decimal  / count(aux.paquete))::numeric(6,2)
                    else 0 
                end as pct_paquetes_liquidados
            from (
                select p.id as paquete, tar.precio as valor, liq.id as liquidacion, liq.monto_total valor_liq
                from paquetes p
                join tarifas tar on p.id_tarifa = tar.id
                left join liquidaciones liq on liq.id = p.id_liquidacion
                where p.fecha between $1 and $2
            ) aux
        `

        const result = await pool.query(
            query,
            [desde, hasta]
        )

        res.json({
            ok: true,
            data: result.rows
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}

export const obtenerLiquidacionesDashboard = async (req, res) => {
    const {
        desde,
        hasta
    } = req.query

    try {
        const query = `
            select
            coalesce(sum(aux.precio),0) as valor_total,
            coalesce(
                sum(
                case 
                    when aux.liq_id is not null 
                    then aux.precio
                    else 0
                end
                ),0
            ) as pago_realizado,
            coalesce(
                sum(
                case 
                    when aux.liq_id is null 
                    then aux.precio
                    else 0
                end
                ),0
            ) as pago_pendiente,
            case when  count(aux.paq_id) > 0 then
                (count(aux.liq_id)::decimal  / count(aux.paq_id))::numeric(6,2)
                else 0 
            end as pct_paquetes_liquidados
            from (
            select liq.id as liq_id, p.id as paq_id, tar.precio as precio
            from paquetes p
            join tarifas tar on p.id_tarifa = tar.id
            left join liquidaciones liq on liq.id = p.id_liquidacion
            where p.fecha between $1 and $2
            ) aux
        `

        const result = await pool.query(
            query,
            [desde, hasta]
        )

        res.json({
            ok: true,
            data: result.rows
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}

export const obtenerLiquidacionesPorTransportista = async (req, res) => {
    const { id } = req.params
    const { desde, hasta } = req.query

    try {
        const query = `
            select
                coalesce(sum(aux.precio), 0) as valor_total,
                coalesce(sum(case when aux.liq_id is not null then aux.precio else 0 end), 0) as pago_realizado,
                coalesce(sum(case when aux.liq_id is null then aux.precio else 0 end), 0) as pago_pendiente
            from (
                select liq.id as liq_id, p.id as paq_id, tar.precio as precio
                from paquetes p
                join transportistas t on t.id = p.id_transportista
                join tarifas tar on tar.id = p.id_tarifa
                left join liquidaciones liq on liq.id = p.id_liquidacion
                where t.id_usuario = $1
                and p.fecha between $2 and $3
            ) aux
        `
        const result = await pool.query(query, [id, desde, hasta])

        res.json({
            ok: true,
            data: result.rows
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
}