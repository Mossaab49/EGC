import { IsIn } from 'class-validator'

export class UpdateMinecraftRequestStatusDto {
  @IsIn(['Acceptee', 'Refusee', 'En attente'])
  status: 'Acceptee' | 'Refusee' | 'En attente'
}
