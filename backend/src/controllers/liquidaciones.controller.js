import pool from '../config/db.js'

export const obtenerLiquidacionesTotales = async (req, res) => {
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
                count(aux.liq_id)::decimal  / count(aux.paq_id)
                else 0 
            end as pct_paquetes_liquidados
            from (
            select liq.id as liq_id, p.id as paq_id, tar.precio as precio
            from paquetes p
            join tarifas tar on p.id_tarifa = tar.id
            left join liquidaciones liq on liq.id_paquete = p.id
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
            SELECT
                coalesce(sum(tar.precio), 0) as valor_total,
                coalesce(sum(case when p.id_liquidacion is not null then tar.precio else 0 end), 0) as pago_realizado,
                coalesce(sum(case when p.id_liquidacion is null then tar.precio else 0 end), 0) as pago_pendiente
            FROM paquetes p
            JOIN transportistas t ON t.id = p.id_transportista
            JOIN tarifas tar ON tar.id = p.id_tarifa
            WHERE t.id_usuario = $1
            AND p.fecha BETWEEN $2 AND $3
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