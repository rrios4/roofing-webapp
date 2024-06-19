using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server.Data;

namespace server.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly PostgresContext _postgresContext;
        public CustomerController(PostgresContext postgresContext)
        {
            _postgresContext = postgresContext;
        }

        [HttpGet]
        public IActionResult GetAllCustomers()
        {
            var customers = _postgresContext.Customers.ToList();

            return Ok(customers);
        }
    }
}