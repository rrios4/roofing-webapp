using System;
using System.Collections.Generic;

namespace server.Models;

/// <summary>
/// Customer request for aa quote based on the service the roofing company offers.
/// </summary>
public partial class QuoteRequest
{
    public long Id { get; set; }

    public DateTime? CreatedAt { get; set; }

    public long? ServiceTypeId { get; set; }

    public long CustomerTypeId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? StreetAddress { get; set; }

    public string? City { get; set; }

    public string? Zipcode { get; set; }

    public string Email { get; set; } = null!;

    public string? CustomService { get; set; }

    public DateOnly? RequestedDate { get; set; }

    public long EstRequestStatusId { get; set; }

    public string? State { get; set; }

    /// <summary>
    /// The requesters phone number can be used to schedule or confirm a date where roofing company will visit to measure the home to create a quote.
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// When changes are made to the data a date will go along side it =.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    public virtual CustomerType CustomerType { get; set; } = null!;

    public virtual QuoteRequestStatus EstRequestStatus { get; set; } = null!;

    public virtual Service? ServiceType { get; set; }
}
