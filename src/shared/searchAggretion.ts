import type { PipelineStage } from "mongoose";
import searchFields from "./searchFields.js";

const searchAggretion = (
    initialPipeLine: PipelineStage[],
    dataFields: string[],
    query: string,
    extraSearch?: PipelineStage[] | undefined
) => {
    const pipeline: PipelineStage[] = [...initialPipeLine];

    const orConditions = searchFields(dataFields, query);
    if (orConditions.length > 0 && query.trim() !== "") {
        pipeline.push({ $match: { $or: orConditions } });
    }

    if (extraSearch) pipeline.push(...extraSearch);
    return pipeline;
};
export default searchAggretion;
