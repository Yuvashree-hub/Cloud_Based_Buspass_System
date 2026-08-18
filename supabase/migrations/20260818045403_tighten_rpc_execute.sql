/*
# Tighten execute permissions on admin RPCs

The approve_application and reject_application SECURITY DEFINER functions
were executable by PUBLIC (which includes the anon role). Although the
function bodies verify the caller is an admin via auth.uid() and profile
role, revoke PUBLIC/anon execute for defense in depth so only authenticated
sessions can invoke them.
*/

REVOKE EXECUTE ON FUNCTION approve_application(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION reject_application(uuid, text) FROM PUBLIC, anon;