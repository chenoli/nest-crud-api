import { SetMetadata } from '@nestjs/common';

import { STRINGS } from '@constants/strings.constants';

export const Public = () => SetMetadata(STRINGS.keys.IS_PUBLIC_KEY, true);
