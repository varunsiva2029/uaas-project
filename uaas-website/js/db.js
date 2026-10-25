/*
 * Ultra Automation Solutions
 * Supabase database layer
 */

(function () {

  var C = window.UAAS_CONFIG;

  if (
    !C ||
    !C.url ||
    C.url.indexOf("YOUR") > -1 ||
    !C.anonKey ||
    !window.supabase
  ) {
    return;
  }

  var sb = window.supabase.createClient(
    C.url,
    C.anonKey
  );

  window.sb = sb;

  sb.auth.getSession().then(function (r) {
    if (r && r.data) {
      window.sbUser = r.data.session;
    }
  });

  function snap(r) {
    return {
      id: r.id,
      data: function () {
        return r;
      }
    };
  }

  function chk(r) {
    if (r.error) {
      throw r.error;
    }
    return r;
  }

  window.dbShim = {
    collection: function (name) {
      return {
        add: function (value) {
          var row = Object.assign({}, value);
          delete row.ts;
          return sb
            .from(name)
            .insert(row)
            .select()
            .single()
            .then(chk);
        },

        where: function (field, operator, value) {
          var p = String(value).split("|");
          var ref = p[0] || "";
          var phone = p[1] || "";

          return {
            get: function () {
              return sb
                .rpc("track_enquiry", {
                  p_ref: ref,
                  p_phone: phone
                })
                .then(chk)
                .then(function (x) {
                  return {
                    docs: (x.data || []).map(snap)
                  };
                });
            }
          };
        },

        orderBy: function () {
          return {
            limit: function (limitValue) {
              return {
                onSnapshot: function (ok, bad) {
                  var stop = false;

                  function load() {
                    sb
                      .from(name)
                      .select("*")
                      .order("created_at", {
                        ascending: false
                      })
                      .limit(limitValue || 100)
                      .then(function (x) {

                        if (stop) return;

                        if (x.error) {
                          if (bad) bad(x.error);
                          return;
                        }

                        ok({
                          docs: (x.data || []).map(snap)
                        });

                      });
                  }

                  load();

                  var channel = sb
                    .channel("uaas-enquiries")
                    .on(
                      "postgres_changes",
                      {
                        event: "*",
                        schema: "public",
                        table: name
                      },
                      load
                    )
                    .subscribe();

                  return function () {
                    stop = true;
                    sb.removeChannel(channel);
                  };
                }
              };
            }
          };
        }
      };
    },

    doc: function (path) {
      var parts = path.split("/");
      var id = parts[1];

      return {
        update: function (value) {
          return sb
            .from("enquiries")
            .update(value)
            .eq("id", id)
            .select()
            .single()
            .then(chk);
        }
      };
    }
  };
})();