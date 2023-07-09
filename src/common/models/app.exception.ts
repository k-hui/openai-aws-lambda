import { HttpException, HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

function getValidStatusCode(value: any): number {
  let code = parseInt(value)
  if (code < 200 || code > 500) {
    code = HttpStatus.BAD_REQUEST
  }
  return code
}

export class AppException extends HttpException {
  @ApiProperty()
  code: number

  @ApiProperty()
  message: string

  constructor(err: any) {
    console.error(err)
    const code = getValidStatusCode(err.code)
    const status = getValidStatusCode(err.status)
    super(err.message, code || status || HttpStatus.FORBIDDEN)
  }
}
