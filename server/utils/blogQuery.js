const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 30;
const SORT_MAP = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    mostLiked: { likes: -1, createdAt: -1 },
};

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const normalizeBlogQueryOptions = (query = {}) => {
    const pageValue = Number.parseInt(query.page ?? DEFAULT_PAGE, 10);
    const limitValue = Number.parseInt(query.limit ?? DEFAULT_LIMIT, 10);

    const safePage = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : DEFAULT_PAGE;
    const safeLimit = Number.isFinite(limitValue) && limitValue > 0 ? Math.min(limitValue, MAX_LIMIT) : DEFAULT_LIMIT;

    const search = typeof query.search === "string" ? query.search.trim() : "";
    const tag = typeof query.tag === "string" ? query.tag.trim() : "";
    const sort = SORT_MAP[query.sort] ? query.sort : "latest";

    return {
        page: safePage,
        limit: safeLimit,
        search,
        tag,
        sort,
    };
};

export const buildBlogQuery = ({ search = "", tag = "", creator = null } = {}) => {
    const filter = {};

    if (creator) {
        filter.creator = creator;
    }

    if (search) {
        filter.$or = [
            { title: { $regex: escapeRegex(search), $options: "i" } },
            { tags: { $in: [new RegExp(escapeRegex(search), "i")] } },
            { creatorUsername: { $regex: escapeRegex(search), $options: "i" } },
        ];
    }

    if (tag) {
        filter.tags = { $in: [new RegExp(`^${escapeRegex(tag)}$`, "i")] };
    }

    return filter;
};

export const buildBlogSort = (sort = "latest") => SORT_MAP[sort] || SORT_MAP.latest;
