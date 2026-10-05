export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 404;
  return res.end(
    JSON.stringify({
      success: false,
      error: `API route not found: ${req.url || ''}`
    })
  );
}
