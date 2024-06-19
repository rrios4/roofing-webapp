using System;
using System.Collections.Generic;

namespace server.Models;

/// <summary>
/// Table that stores all the customers for roofing company
/// </summary>
public partial class Customer
{
    public long Id { get; set; }

    public long CustomerTypeId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? StreetAddress { get; set; }

    public string? City { get; set; }

    public string? Zipcode { get; set; }

    public string? PhoneNumber { get; set; }

    public string Email { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? CompanyName { get; set; }

    public string? State { get; set; }

    public virtual CustomerType CustomerType { get; set; } = null!;

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<Quote> Quotes { get; set; } = new List<Quote>();
}
