SELECT
    m.id,
    to_user.username,
    to_user.first_name,
    to_user.last_name,
    to_user.phone,
    m.body,
    m.sent_at,
    m.read_at

FROM users as u
JOIN messages as m ON
    u.username = m.from_username
JOIN users as to_user on
    m.to_username = to_user.username
WHERE u.username = 'janedoe';