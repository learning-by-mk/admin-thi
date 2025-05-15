export interface InteractionStatsSummary {
    ratings: {
        total: number;
        average: number;
        newCount: number;
        growthRate: number;
    };
    favorites: {
        total: number;
        newCount: number;
        averagePerDocument: number;
        growthRate: number;
    };
    comments: {
        total: number;
        newCount: number;
        averagePerDocument: number;
        growthRate: number;
    };
    downloads: {
        total: number;
        newCount: number;
        averagePerDocument: number;
        growthRate: number;
    };
}

export interface TimeSeriesData {
    labels: string[];
    values: number[];
}

export interface InteractionTimeSeriesData {
    ratings: {
        counts: TimeSeriesData;
        averageScores: TimeSeriesData;
    };
    favorites: {
        counts: TimeSeriesData;
    };
    comments: {
        counts: TimeSeriesData;
    };
    downloads: {
        counts: TimeSeriesData;
    };
}

export interface TopDocument {
    id: number;
    title: string;
    interactionCount: number;
    interactionTypes: {
        ratings: number;
        favorites: number;
        comments: number;
        downloads: number;
    };
}

export interface InteractionDistribution {
    labels: string[];
    values: number[];
}

export interface InteractionStats {
    summary: InteractionStatsSummary;
    timeSeriesData: InteractionTimeSeriesData;
    topDocuments: TopDocument[];
    interactionDistribution: InteractionDistribution;
}
