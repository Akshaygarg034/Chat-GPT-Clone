interface Message {
    text: string
    createdAt: Date
    user: {
        _id: string
        name: string
    }
}