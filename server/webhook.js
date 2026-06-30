const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/2lldanxxjx6zekda6a9j6gv3ggoamsdu';

/**
 * Triggers Make.com webhook when a request is assigned to a practitioner.
 * Runs asynchronously and logs status to console.
 * @param {Object} request The updated request object
 */
export async function triggerAssignmentWebhook(request) {
  console.log(`[Webhook] Triggering assignment webhook for request: ${request.RequestID} (Assigned to: ${request.AssignedTo || 'Unassigned'})`);
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log(`[Webhook] Successfully sent data to Make.com for request: ${request.RequestID}`);
  } catch (error) {
    console.error(`[Webhook Error] Failed to trigger webhook for request ${request.RequestID}:`, error.message);
  }
}
