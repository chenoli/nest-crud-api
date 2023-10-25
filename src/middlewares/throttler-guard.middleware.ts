import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

import { STRINGS } from '@constants/strings.constants';

export class MyThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(STRINGS.errors.requests.TOO_MANY);
  }
}
