SELECT
	count(*) as total
FROM
	filefulltext
WHERE
	MATCH (utf8segments) AGAINST ('{keyword}')