import { ApiProperty } from "@nestjs/swagger";
import { Event } from "apps/address/entities";
import { IsArray } from "class-validator";


export class GetEventsOutput{
    @IsArray()
    @ApiProperty({ type: () => [Event] })
    events: Event[]
}

export class GetEventOutput  {
    @ApiProperty({ type: () => Event })
    event?: Event
}