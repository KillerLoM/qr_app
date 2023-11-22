export interface Wine {
    id_wine: number,
    namewine: string,
    is_hidden: boolean | null,
    created_date: Date,
    codewine: String,
    effect: string,
    moreinfo: string,
    image: string | null,
    image1: string | null,
    image2: string | null,
    image3: string | null,
    image4: string | null,
    volumewine: string,
    cc: number,
    otp: string,
    ginsnegId: number,
    ginseng: {
        code: String,
    }
}
