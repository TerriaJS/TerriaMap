vcl 4.0;

backend default {
    .host = "127.0.0.1";
    .port = "3001";
}

sub vcl_recv {
  if (req.url ~ "^/proxy"){
    return (hash);
  }
}

sub vcl_backend_response {
  if (beresp.status >= 400) {
    set beresp.ttl = 0s;
  }
}
