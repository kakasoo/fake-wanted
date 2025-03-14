import api from "@kakasoo/fake-wanted-api";

export async function test_api_monitor_health_check(
  connection: api.IConnection,
): Promise<void> {
  await api.functional.monitors.health.get(connection);
}
