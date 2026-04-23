import type { Context } from "hono";

export type Envelope<T> = {
  success: boolean;
  data: T | null;
  error: { code?: string; status?: number; message: string[] } | null;
};

export const ok = <T>(c: Context, data: T, status = 200) =>
  c.json<Envelope<T>>({ success: true, data, error: null }, status as 200);

export const fail = (
  c: Context,
  status: number,
  code: string,
  message: string | string[],
) =>
  c.json<Envelope<null>>(
    {
      success: false,
      data: null,
      error: {
        code,
        status,
        message: Array.isArray(message) ? message : [message],
      },
    },
    status as 400,
  );
