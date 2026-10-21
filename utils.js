export function parseProperties(properties) {
    if (!properties) return {};
    if (typeof properties === 'object') return properties;
    try {
        return JSON.parse(properties);
    } catch {
        return properties;
    }
}

export function stringifyProperties(properties) {
    if (properties === undefined || properties === null) return '{}';
    if (typeof properties === 'string') return properties;
    try {
        return JSON.stringify(properties);
    } catch {
        return '{}';
    }
}

export function validateItemData(data, isPatch = false) {
    const errors = [];

    if (!data || typeof data !== 'object') {
        return { isValid: false, errors: ['Тело запроса должно быть объектом JSON'] };
    }

    if (!isPatch) {
        if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
            errors.push('Поле "name" обязательно и должно быть непустой строкой');
        }
        if (data.status !== undefined && (typeof data.status !== 'string' || data.status.trim() === '')) {
            errors.push('Поле "status" должно быть строкой');
        }
    } else {
        if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim() === '')) {
            errors.push('Поле "name" должно быть непустой строкой');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function parseQueryParams(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const filters = {};
    if (query.status) filters.status = query.status;
    if (query.category_id) filters.category_id = Number(query.category_id);
    if (query.q) filters.q = query.q;

    let orderBy = 'id ASC';
    if (query.name) {
        const dir = query.name.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        orderBy = `name ${dir}`;
    } else if (query.order) {
        const [col, dir] = query.order.split(':');
        const allowedCols = ['id', 'name', 'status', 'category_id'];
        if (allowedCols.includes(col)) {
            orderBy = `${col} ${dir && dir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
        }
    }

    return {
        page,
        limit,
        offset,
        filters,
        orderBy,
    };
}

export function formatItemResponse(item) {
    if (!item) return null;
    return {
        ...item,
        properties: parseProperties(item.properties),
    };
}

export default {
    parseProperties,
    stringifyProperties,
    validateItemData,
    parseQueryParams,
    formatItemResponse,
};
