export declare class RabbitMQService {
    publish(_routingKey: string, _message: unknown): Promise<void>;
    consume(_routingKey: string, _handler: (message: unknown) => Promise<void>): Promise<void>;
}
export declare class RabbitMQModule {
}
