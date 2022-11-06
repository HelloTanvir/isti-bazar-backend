export interface FilterQuery {
    name: string;
    startDate: string | Date;
    endDate: string | Date;
    updatedAt?: {
        $gte?: Date;
        $lte?: Date;
    };
}
