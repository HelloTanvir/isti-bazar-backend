export interface FilterQuery {
    _id: string;
    status: string;
    customerName: string;
    customerNumber: string;
    startDate: string | Date;
    endDate: string | Date;
    updatedAt?: {
        $gte?: Date;
        $lte?: Date;
    };
}
